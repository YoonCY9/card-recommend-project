package card_recommend_project.card_recommend_project.google;

import card_recommend_project.card_recommend_project.user.User;
import card_recommend_project.card_recommend_project.user.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class OAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public OAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User oAuth2User = super.loadUser(userRequest);

        String id = userRequest.getClientRegistration().getRegistrationId();

        OAuth2Response oAuth2Response = null;
        if (id.equals("google")) {
            oAuth2Response = new GoogleResponse(oAuth2User.getAttributes());
            System.out.println(oAuth2Response.getName());
            System.out.println(oAuth2Response.getEmail());
            System.out.println(oAuth2Response.getPicture());
        } else return null;

        // 사용자를 특정할 아이디값 만들기
        String userName = oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId();

        User existData = userRepository.findByUsername(userName);
        // db에 유저정보가 null이면 새로추가 , 있으면 업데이트
        if (existData == null) {
            User user = new User();
            user.setUsername(userName);
            user.setEmail(oAuth2Response.getEmail());
            user.setName(oAuth2Response.getName());
            user.setRole("ROLE_USER");
            user.setPicture(oAuth2Response.getPicture());

            userRepository.save(user);

            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(userName);
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRole("ROLE_USER");
            userDTO.setPicture(oAuth2Response.getPicture());

            return new CustomOAuth2User(userDTO);
        } else {
            existData.setEmail(oAuth2Response.getEmail());
            existData.setName(oAuth2Response.getName());

            userRepository.save(existData);

            UserDTO userDTO = new UserDTO();
            userDTO.setUsername(existData.getUsername());
            userDTO.setName(oAuth2Response.getName());
            userDTO.setRole(existData.getRole());
            userDTO.setPicture(existData.getPicture());

            return new CustomOAuth2User(userDTO);
        }
    }
}
