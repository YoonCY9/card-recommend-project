package card_recommend_project.card_recommend_project.admin;

import card_recommend_project.card_recommend_project.loginUtils.AccessToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AdminController {

    private final LoginService loginService;

    public AdminController(LoginService loginService) {
        this.loginService = loginService;
    }

    @PostMapping("/admin/login")
    public AccessToken loginAdmin(@RequestBody LoginDTO request) {

        return loginService.loginAdmin(request);
    }
}
