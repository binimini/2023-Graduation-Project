package oncoding.concoder.service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import oncoding.concoder.dto.ProblemDto;
import oncoding.concoder.model.Category;
import oncoding.concoder.model.Level;
import oncoding.concoder.model.Problem;
import oncoding.concoder.repository.CategoryRepository;
import oncoding.concoder.repository.ProblemRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class ProblemService {
    private final ProblemRepository problemRepository;
    private final CategoryRepository categoryRepository;
    private final LevelService levelService;
    private final CrawlingService crawlingService;

    public Problem getProblemByNumber(int number) {
        return problemRepository
            .findFirstByNumber(number).get();
            // TODO : 해당하는 Problem 존재하지 않을 경우 예외 처리
    }

    public List<Problem> getProblemsByLevelStandard(UUID id) {
        return problemRepository.findRandomByLevel(id, 5);
    }

    public List<Problem> getProblemsByCategoryStandard(Integer id) {
        return problemRepository.findRandomByCategory(id, 5);
    }

    public int getProblemNumberByCategoryAndTier(int categoryNumber, Integer tier) {
        log.info("user tier "+ (tier <= 5 ? tier+1 : tier));
        tier = tier <= 5 ? tier + 2 : tier; // Bronze 구간일 경우 문제 범위 적으므로 범위 + 2 까지 확장
        int finalTier = tier;
        return problemRepository.findSimilarLevelByCategory(categoryNumber, tier <= 5 ? 5 : tier)
                // 확장한 범위 내에서 추천된 카테고리 문제 없을 경우 해당 난이도 기반 랜덤 문제로 선정
                .orElseGet(() -> problemRepository.findRandomByLevel(levelService.getLevelByNumber(finalTier).getId(), 1).get(0))
                .getNumber();
    }

    @Scheduled(cron = "0 0/20 * * * *")
    public void createProblems() throws IOException {
        Optional<Problem> lastNumberProblem = problemRepository.findTopByOrderByNumberDesc();

        int startNumber = lastNumberProblem.map(value -> value.getNumber() + 1).orElse(1000);
        List<ProblemDto.CreateRequest> rawProblems  = crawlingService.getRawProblems(startNumber);

        List<Integer> rawLevels = rawProblems.stream()
            .map(ProblemDto.CreateRequest::getLevel)
            .collect(Collectors.toList());
        Map<Integer, Level> levelMap = levelService.getLevelMapByNumbers(rawLevels);

        List<Problem> problems = new ArrayList<>();
        for (ProblemDto.CreateRequest rawProblem : rawProblems) {
            String category = rawProblem.getTags()
                .stream()
                .map(t -> t.getBojTagId() + ";")
                .collect(Collectors.toList()).toString();
            List<Category> categories = rawProblem.getTags()
                .stream()
                .map(t -> new Category(t.getDisplayNames().get(0).getName(), t.getBojTagId(), t.getProblemCount()))
                .collect(Collectors.toList());
            categoryRepository.saveAll(categories);
            Map<String, String> content = crawlingService.getContent(rawProblem.getProblemId());
            Problem problem = Problem.builder()
                .number(rawProblem.getProblemId())
                .title(rawProblem.getTitleKo())
                .description(content.get("description"))
                .input(content.get("input"))
                .output(content.get("output"))
                .level(levelMap.get(rawProblem.getLevel()))
                .averageTries(rawProblem.getAverageTries())
                .timeLimit(Integer.parseInt(content.get("timeLimit").replaceAll("[^\\d]*", "")))
                .memoryLimit(Integer.parseInt(content.get("memoryLimit").replaceAll("[^\\d]*", "")))
                .categories(category)
                .build();
            problems.add(problem);
        }
        problemRepository.saveAll(problems);
    }

    public List<Problem> getProblemByNumbers(List<Integer> recommends) {
        return problemRepository.findAllByNumberIn(recommends);
    }
}
