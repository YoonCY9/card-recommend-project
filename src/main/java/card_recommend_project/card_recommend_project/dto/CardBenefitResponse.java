package card_recommend_project.card_recommend_project.dto;
import card_recommend_project.card_recommend_project.Category;

public record CardBenefitResponse(
        Category bnfName,
        String bnfContent,
        String bnfDetail
) {
}
