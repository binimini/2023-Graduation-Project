package oncoding.concoder.config;

import java.io.Serializable;
import java.util.concurrent.TimeUnit;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureTestDatabase(replace = Replace.NONE)
public class RedisBasicTest {
    
    @Autowired
    RedisTemplate<String, String> redisTemplate1;
    @Autowired
    RedisTemplate<String, Object> redisTemplate;
    
 
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RedisUserDto implements Serializable {
        private String name;
        private String password;
    }
    
    /**
     * 단순 연결 테스트 -  key와 value 삽입
     */
    @Test
    void redisConnectionTest() {
        final String key = "a";
        final String data = "1";

        final ValueOperations<String, String> valueOperations = redisTemplate1.opsForValue();
        valueOperations.set(key, data);


        final String s = valueOperations.get(key);
        Assertions.assertThat(s).isEqualTo(data);
    }

    /**
     * 위 코드 redis에 삽입한 아이템에 대해서 5초의 expire time을 설정하고, 5초가 지난 후에 redis에서 해당 키가 조회되는지 테스트하는 코드
     * @throws InterruptedException
     */
    @Test
    void redisExpireTest() throws InterruptedException {
        final String key = "a";
        final String data = "1";
        final ValueOperations<String, String> valueOperations = redisTemplate1.opsForValue();
        valueOperations.set(key, data);
        final Boolean expire = redisTemplate.expire(key, 5, TimeUnit.SECONDS);
        Thread.sleep(6000);
        final String s = valueOperations.get(key);

    }
    
}
