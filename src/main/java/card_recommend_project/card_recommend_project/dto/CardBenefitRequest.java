package card_recommend_project.card_recommend_project.dto;

import card_recommend_project.card_recommend_project.cardBenefit.Category;

public record CardBenefitRequest(
        Category bnfName,
        String bnfContent,
        String bnfDetail,
        Long cardId

) {
}
