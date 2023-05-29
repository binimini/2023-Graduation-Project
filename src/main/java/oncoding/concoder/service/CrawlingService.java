package oncoding.concoder.service;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import oncoding.concoder.dto.ProblemDto;
import oncoding.concoder.dto.ProblemDto.UserInfo;
import oncoding.concoder.dto.ProblemDto.UserStruct;
import org.jsoup.Connection;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@Transactional
@RequiredArgsConstructor
public class CrawlingService {
    private static final String BOJ_URL = "https://www.acmicpc.net/problem/";
    private static final String SOLVEDAC_URL = "https://solved.ac/api/v3/problem/lookup?problemIds=";
    private static final String SOLVEDAC_USER_URL = "https://solved.ac/api/v3/search/user?query=";
    private static final String SOLVEDAC_USER_TAG_URL = "https://solved.ac//api/v3/user/problem_tag_stats?handle=";
    private static final int CRAWLING_COUNT = 10;

    public Document connect(int number) throws IOException {
        Connection connection = Jsoup.connect(BOJ_URL+number);
        Document document = connection.get();
        return document;
    }

    public String joinElementsText(Elements elements, String seperator) {
        StringBuilder builder = new StringBuilder();
        for (Element element : elements) {
            builder.append(element.text());
            builder.append(seperator);
        }
        return builder.toString();
    }

    public String getProblemIds(int startNumber) {
        StringBuilder builder = new StringBuilder();
        for (int i = 0; i<CRAWLING_COUNT; i++) {
            builder.append(startNumber+i);
            if (i==CRAWLING_COUNT-1) break;
            builder.append(",");
        }
        return builder.toString();
    }

    public Map<String, String> getContent(int number) throws IOException {
        Document document = connect(number);
        Map<String, String> content = new HashMap<>();

        Elements descriptions = document.select("#problem_description");
        content.put("description", joinElementsText(descriptions, "\n"));
        Elements inputs = document.select("#problem_input");
        content.put("input", joinElementsText(inputs, "\n"));
        Elements outputs = document.select("#problem_output");
        content.put("output", joinElementsText(outputs, "\n"));

        Element time = document.select("#problem-info > tbody > tr > td:nth-child(1)").get(0);
        Element memory = document.select("#problem-info > tbody > tr > td:nth-child(2)").get(0);
        content.put("timeLimit", time.text());
        content.put("memoryLimit", memory.text());

        return content;
    }

    public List<ProblemDto.CreateRequest> getRawProblems(int startNumber) throws IOException {
        String problemIds = getProblemIds(startNumber);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<List<ProblemDto.CreateRequest>> response = restTemplate.exchange(
            SOLVEDAC_URL+problemIds,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<>(){});
        List<ProblemDto.CreateRequest> rawProblems = response.getBody();
        return rawProblems;
    }

    public UserInfo getUserInfo(String accountId) {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<UserStruct> response = restTemplate.exchange(
            SOLVEDAC_USER_URL+accountId,
            HttpMethod.GET,
            null,
            new ParameterizedTypeReference<>(){});
        UserStruct result = response.getBody();


        if (result.getCount()==0) throw new NoSuchElementException("해당하는 사용자가 없습니다.");
        return result.getItems().get(0);
    }

    public Integer getUserWeakCategoryNumber(String accountId) {
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<ProblemDto.UserTagStruct> response = restTemplate.exchange(
                SOLVEDAC_USER_TAG_URL+accountId,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>(){});

        // TODO : Not Found 처리
        ProblemDto.UserTagStruct result = response.getBody();

        if (result == null) throw new NoSuchElementException("해당하는 사용자가 없습니다.");

        // TODO : remove magic number
        List<ProblemDto.UserTagInfo> userTagInfo = result.getItems().stream().filter((tag) -> tag.getTotal() > 300).collect(Collectors.toList());

        Map<Integer, Double> sortedMap = new TreeMap<>();

        userTagInfo.forEach(tag -> {
            double score = (tag.getTotal() * 2  - tag.getSolved() * 2 - tag.getPartial() * 1) / (double) (tag.getTotal() * 2) * 10  +  (tag.getTotal() / (double) 900);
            System.out.println(tag.getTag().getDisplayNames().get(0).getName() + " 유형 점수 " + score);
            System.out.println("전체 해결 "+ tag.getSolved() + " / " + tag.getTotal());
            System.out.println("부분 해결 "+ tag.getPartial() + " / " + tag.getTotal());
            sortedMap.put(tag.getTag().getBojTagId(), score);
        });

        Iterator<Map.Entry<Integer, Double>> iter = sortedMap.entrySet().iterator();
        int rand = new Random(new Date().getTime()).nextInt(3);
        System.out.println("random number : " + rand);
        for (int i = 0; i < rand; i++) {
            iter.next();
        }
        return iter.next().getKey();
    }

}
