package oncoding.concoder.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import oncoding.concoder.model.Problem;

public interface ProblemCustomRepository {
    List<Problem> findRandomByLevel(UUID id, int limit);
    List<Problem> findRandomByCategory(int id, int limit);
    Optional<Problem> findSimilarLevelByCategory(int id, int tier);
}