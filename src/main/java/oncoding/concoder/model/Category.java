package oncoding.concoder.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Category {
    @Column
    @Id
    private Integer id;

    @Column
    @NotNull
    private String name;

    @Column
    @NotNull
    private Integer totalCount;

    @Builder
    public Category(String name, Integer bojTagId, Integer totalCount) {
        this.id = bojTagId;
        this.name = name;
        this.totalCount = totalCount;
    }
}
