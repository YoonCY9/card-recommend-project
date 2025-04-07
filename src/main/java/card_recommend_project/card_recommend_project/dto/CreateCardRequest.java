package card_recommend_project.card_recommend_project.dto;

import card_recommend_project.card_recommend_project.card.Card_In_Out;

import java.util.List;

public record CreateCardRequest(
        String cardBrand,
        String cardName,
        Card_In_Out Domestic,
        Integer domesticOfferAmount,
        Card_In_Out Overseas,
        Integer overseasAmount,
        String cardImage,
        Integer record,
        List<String> cardOverseas
) {
}
