package card_recommend_project.card_recommend_project.user;

import card_recommend_project.card_recommend_project.loginUtils.JwtProvider;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserController {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    public UserController(UserRepository userRepository, JwtProvider jwtProvider) {
        this.userRepository = userRepository;
        this.jwtProvider = jwtProvider;
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@CookieValue("Authorization") String token) {
        String username = jwtProvider.getSubject(token);
        User user = userRepository.findByUsername(username);

        return ResponseEntity.ok(Map.of(
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole(),
                "profile",user.getPicture()
        ));
    }

}
