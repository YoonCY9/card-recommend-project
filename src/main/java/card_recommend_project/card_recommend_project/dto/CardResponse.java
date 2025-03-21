package card_recommend_project.card_recommend_project.dto;

import card_recommend_project.card_recommend_project.CardBenefit;
import card_recommend_project.card_recommend_project.Offer;

import java.util.List;

public record CardResponse(
        Long id,
        String name,
        String img,
        List<String> bnfContent,
        int record,
        String brand
) {

}
