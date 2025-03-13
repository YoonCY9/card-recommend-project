package card_recommend_project.card_recommend_project.google;

import org.springframework.core.convert.converter.Converter;

public class SocialLoginTypeConverter implements Converter<String, SocialLoginType> {
    @Override
    public SocialLoginType convert(String s) {
        return SocialLoginType.valueOf(s.toUpperCase());
    }
}
