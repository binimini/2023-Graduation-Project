package oncoding.concoder.controller;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import oncoding.concoder.dto.CategoryDto;
import oncoding.concoder.dto.LevelDto;
import oncoding.concoder.dto.ProblemDto;
import oncoding.concoder.dto.ProblemDto.UserInfo;
import oncoding.concoder.dto.ProblemDto.UserResponse;
import oncoding.concoder.mapper.CategoryDtoMapper;
import oncoding.concoder.mapper.LevelDtoMapper;
import oncoding.concoder.mapper.ProblemDtoMapper;
import oncoding.concoder.model.Level;
import oncoding.concoder.service.CategoryService;
import oncoding.concoder.service.CrawlingService;
import oncoding.concoder.service.LevelService;
import oncoding.concoder.service.ProblemService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping(value = "/problems", produces = MediaType.APPLICATION_JSON_VALUE)
@RequiredArgsConstructor
public class ProblemController {
    private final ProblemService problemService;
    private final CategoryService categoryService;
    private final LevelService levelService;
    private final CrawlingService crawlingService;

    private final CategoryDtoMapper categoryDtoMapper;
    private final LevelDtoMapper levelDtoMapper;
    private final ProblemDtoMapper problemDtoMapper;

    @PostMapping("/crawling")
    public void createProblems() {
        try {
            problemService.createProblems();
        }
        catch (IOException e) {
            log.info(e.getMessage());
        }
    }

    @GetMapping("/categories")
    public List<CategoryDto.Response> getCategories() {
        return categoryDtoMapper.toResponseList(categoryService.getCategories());
    }

    @GetMapping("/levels")
    public List<LevelDto.Response> getLevels() {
        return levelDtoMapper.toResponseList(levelService.getLevels());
    }

    @GetMapping("/random")
    public List<ProblemDto.AllResponse> getProblems(@RequestParam("standard") String standard,
                                                    @RequestParam(required = false) UUID level,
                                                    @RequestParam(required=false) Integer category) {
        if (standard.equals("level")) return problemDtoMapper.toAllResponseList(problemService.getProblemsByLevelStandard(level));
        else if (standard.equals("category")) return problemDtoMapper.toAllResponseList(problemService.getProblemsByCategoryStandard(category));
        else throw new IllegalArgumentException();
    }

    @GetMapping("")
    public ProblemDto.AllResponse getProblem(@RequestParam("number") int number) {
        return problemDtoMapper.toAllResponse(problemService.getProblemByNumber(number));
    }

    @GetMapping("/user/{accountId}")
    public ProblemDto.UserResponse getUser(@PathVariable("accountId") String accountId) {
        UserInfo userInfo = crawlingService.getUserInfo(accountId);
        Level level = levelService.getLevelByNumber(userInfo.getTier());
        return new UserResponse(userInfo, level);
    }
}
