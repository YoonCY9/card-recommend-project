package card_recommend_project.card_recommend_project.dto;

public record CardDetailResponse(
        Long id,
        String name,
        String img,
        String benefit,
        String record
) {
}
