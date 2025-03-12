package card_recommend_project.card_recommend_project.dto;

import java.util.List;

public record CardDetailResponse(
        Long id,
        String name,
        String img,
        List<CardBenefitResponse> benefits,
        int record
) {
}
