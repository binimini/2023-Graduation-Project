package oncoding.concoder.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

public class CategoryDto {
    @Getter
    @Setter
    @ToString
    @AllArgsConstructor
    public static class Response {
        private Integer id;
        private String name;
        private Integer totalCount;
    }
}
