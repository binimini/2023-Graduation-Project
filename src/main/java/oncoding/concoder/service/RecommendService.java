package oncoding.concoder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class RecommendService {

    public List<Integer> recommendProblems(int standardNumber) throws Exception {
        ProcessBuilder processBuilder = new ProcessBuilder("python3", Paths.get("recommend/app.py").toString());
        Process process = processBuilder.start();

        // write input
        log.info("standard problem number : " + standardNumber);
        OutputStream stdin = process.getOutputStream();
        BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(stdin));
        bw.write(Integer.toString(standardNumber));
        bw.close();

        // process end
        int exitCode = process.waitFor();

        // read output
        InputStream stdout = exitCode!=0 ? process.getErrorStream() : process.getInputStream();
        BufferedReader br =  new BufferedReader(new InputStreamReader(stdout, StandardCharsets.UTF_8));

        List<String> outputs = new ArrayList<>();
        String line;
        while ((line = br.readLine()) != null) {
            outputs.add(line);
        }

        String result = exitCode != 0 ? "failed" : "success";
        log.info("run " + result + " with exit code " + exitCode);

        if (exitCode != 0) throw new RuntimeException("추천 문제 생성에 실패했습니다");

        return outputs.stream().map(Integer::parseInt).collect(Collectors.toList());
    }
}
