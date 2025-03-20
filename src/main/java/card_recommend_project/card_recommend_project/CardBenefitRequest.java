package card_recommend_project.card_recommend_project;

public record CardBenefitRequest(
        Category bnfName,
        String bnfContent,
        String bnfDetail,
        Long cardId

) {
}
