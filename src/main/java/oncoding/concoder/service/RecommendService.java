package oncoding.concoder.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Paths;
import java.util.Arrays;
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
        bw.write(standardNumber);
        bw.newLine();
        bw.close();

        // process end
        int exitCode = process.waitFor();

        // read output
        InputStream stdout = exitCode!=0 ? process.getErrorStream() : process.getInputStream();
        BufferedReader br =  new BufferedReader(new InputStreamReader(stdout, StandardCharsets.UTF_8));

        String line;
        while ((line = br.readLine()) != null) {
            System.out.println(line);
        }
        String numbers = br.readLine();

        String result = exitCode!=0 ? "failed" : "success";
        log.info("run " + result + " with exit code " + exitCode);

        return Arrays.stream(numbers.split(" ")).map(Integer::parseInt).collect(Collectors.toList());
    }
}
