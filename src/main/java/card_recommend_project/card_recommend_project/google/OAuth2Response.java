package card_recommend_project.card_recommend_project.google;

public interface OAuth2Response {

    //제공자
    String getProvider();

    //발급해주는 아이디
    String getProviderId();

    //이메일
    String getEmail();

    //사용자 실명
    String getName();

    String getPicture();
}
