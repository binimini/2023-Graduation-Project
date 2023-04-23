package oncoding.concoder.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import oncoding.concoder.model.Level;

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
    public static class UserStruct {
        private Integer count;
        private List<UserInfo> items;
    }

    @Getter
    @Setter
    @ToString
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserInfo {
        private String handle;
        private String profileImageUrl;
        private Integer solvedCount;
        private Integer tier;
    }

    @Getter
    @Setter
    @ToString
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserResponse {
        private String userId;
        private String profileImageUrl;
        private Integer solvedCount;
        private Level level;

        public UserResponse(UserInfo userInfo, Level level) {
            this.userId = userInfo.handle;
            this.profileImageUrl = userInfo.profileImageUrl;
            this.solvedCount = userInfo.solvedCount;
            this.level = level;
        }
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
