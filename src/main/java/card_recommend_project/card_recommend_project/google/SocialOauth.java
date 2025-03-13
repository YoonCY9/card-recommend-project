package card_recommend_project.card_recommend_project.google;

public interface SocialOauth {
    String getOauthRedirectURL();

    String requestAccessToken(String code);

    default SocialLoginType type() {
        if (this instanceof GoogleOauth) {
            return SocialLoginType.GOOGLE;
        } else {
            return null;
        }
    }
}
