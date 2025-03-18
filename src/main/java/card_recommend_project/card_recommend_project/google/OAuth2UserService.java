package card_recommend_project.card_recommend_project.google;

import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
public class OAuth2UserService extends DefaultOAuth2UserService {

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {

        OAuth2User user = super.loadUser(userRequest);

        String id = userRequest.getClientRegistration().getRegistrationId();

        OAuth2Response oAuth2Response = null;
        if (id.equals("google")) {
            oAuth2Response = new GoogleResponse(user.getAttributes());
        } else return null;

        // 사용자를 특정할 아이디값 만들기
        String userName = oAuth2Response.getProvider() + " " + oAuth2Response.getProviderId();

        UserDTO userDTO = new UserDTO();
        userDTO.setUsername(userName);
        userDTO.setName(oAuth2Response.getName());
        userDTO.setRole("ROLE_USER");

        return new CustomOAuth2User(userDTO);
    }
}
