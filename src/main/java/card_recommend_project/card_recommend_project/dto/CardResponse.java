package card_recommend_project.card_recommend_project.dto;

public record CardResponse(
        Long id,
        String name,
        String img,
        String benefit,
        String record
) {
}
