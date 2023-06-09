package oncoding.concoder.repository;

import static oncoding.concoder.model.QCategory.category;
import static oncoding.concoder.model.QLevel.level;

import com.querydsl.core.types.Order;
import com.querydsl.core.types.OrderSpecifier;
import com.querydsl.core.types.dsl.Expressions;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import oncoding.concoder.model.Problem;
import oncoding.concoder.model.QProblem;
import org.springframework.data.jpa.repository.support.QuerydslRepositorySupport;

public class ProblemCustomRepositoryImpl extends QuerydslRepositorySupport implements  ProblemCustomRepository {
    public ProblemCustomRepositoryImpl() {
        super(Problem.class);
    }

    @Override
    public List<Problem> findRandomByLevel(UUID id, int limit) {
        final QProblem problem = QProblem.problem;

        return from(problem)
            .innerJoin(problem.level, level)
            .fetchJoin()
            .where(level.id.eq(id))
            .fetchJoin()
            .orderBy(Expressions.numberTemplate(Double.class, "function('rand')").asc())
            .limit(limit)
            .fetch();
    }

    @Override
    public List<Problem> findRandomByCategory(int id, int limit) {
        final  QProblem problem = QProblem.problem;

        return from(problem)
            .where(problem.categories.contains(id+";"))
            .leftJoin(problem.level, level)
            .fetchJoin()
            .orderBy(Expressions.numberTemplate(Double.class, "function('rand')").asc())
            .limit(limit)
            .fetch();
    }

    @Override
    public Optional<Problem> findSimilarLevelByCategory(int id, int tier) {
        final  QProblem problem = QProblem.problem;

        try {
            System.out.println(tier);
            return Optional.of(from(problem)
                .where(problem.categories.contains("["+id+";").or(problem.categories.contains(", "+id+";")))
                .leftJoin(problem.level, level)
                .fetchJoin()
                .where(problem.level.number.loe(tier).and(problem.level.number.ne(0)))
                .orderBy(problem.level.number.desc(), Expressions.numberTemplate(Double.class, "function('rand')").asc())
                .limit(1)
                .fetch()
                .get(0));
        } catch (IndexOutOfBoundsException e) {
            System.out.println("??");
            return Optional.empty();
        }
    }
}