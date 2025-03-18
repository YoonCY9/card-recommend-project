package card_recommend_project.card_recommend_project.admin;

import card_recommend_project.card_recommend_project.loginUtils.AccessToken;
import card_recommend_project.card_recommend_project.loginUtils.JwtProvider;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    private final JwtProvider jwtProvider;
    private final AdminRepository adminRepository;

    public LoginService(JwtProvider jwtProvider, AdminRepository adminRepository) {
        this.jwtProvider = jwtProvider;
        this.adminRepository = adminRepository;
    }

    public AccessToken loginAdmin(LoginDTO request) {
        Admin admin = adminRepository.findByLoginId(request.loginId());
        if(admin == null || !admin.isCorrectPassword(request.password())){
            throw new IllegalArgumentException("등록되지 않은 아이디 / 비밀번호 오류");
        }
        return new AccessToken(jwtProvider.createToken(admin.getLoginId()));
    }
}
