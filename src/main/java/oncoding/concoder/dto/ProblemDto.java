package oncoding.concoder.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

public class ProblemDto {

    @Getter
    @Setter
    @ToString
    @AllArgsConstructor
    public static class AllResponse {
        private Integer number;
        private String title;
        private Float averageTries;
        private String description;
        private String input;
        private String output;
        private LevelDto.Response level;
        private String categories;
    }

    @Getter
    @Setter
    @ToString
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TagStruct {
        private String key;
        private Integer bojTagId;
        private Integer problemCount;
        private List<TagNameStruct> displayNames;
    }

    @Getter
    @Setter
    @ToString
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TagNameStruct {
        private String name;
        private String language;
    }

    @Getter
    @Setter
    @ToString
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CreateRequest {
        private Integer problemId;
        private String titleKo;
        private Integer level;
        private Float averageTries;
        private List<TagStruct> tags;
    }
}
