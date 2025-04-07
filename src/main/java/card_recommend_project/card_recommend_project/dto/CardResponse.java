package card_recommend_project.card_recommend_project.dto;

import java.util.List;

public record CardResponse(
        Long id,
        String name,
        String img,
        Integer domesticOfferAmount,
        Integer overseasOfferAmount,
        List<String> bnfContent,
        int record,
        String brand
) {

}
