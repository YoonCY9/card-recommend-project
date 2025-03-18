package card_recommend_project.card_recommend_project.google;

import java.util.Map;

public record GoogleResponse(Map<String, Object> attribute) implements OAuth2Response {

    // 데이터가 Map으로 전달되어옴, google,sub,email,name = 반환받은 Map의 키의 이름

    @Override
    public String getProvider() {
        return "google";
    }

    @Override
    public String getProviderId() {
        return attribute.get("sub").toString();
    }

    @Override
    public String getEmail() {
        return attribute.get("email").toString();
    }

    @Override
    public String getName() {
        return attribute.get("name").toString();
    }

    @Override
    public String getPicture() {
        return attribute.get("picture").toString();
    }
}
