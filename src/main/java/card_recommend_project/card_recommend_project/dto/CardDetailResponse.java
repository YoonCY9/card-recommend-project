package card_recommend_project.card_recommend_project.dto;

import java.util.List;

public record CardDetailResponse(
        Long id,
        String name,
        String brand,
        String img,
        String domesticOfferType,
        Integer domesticOfferAmount,
        String overseasOfferType,
        Integer overseasOfferAmount,
        Integer record,
        List<String> cardOverseas,
        List<CardBenefitResponse> benefits
) {
}
