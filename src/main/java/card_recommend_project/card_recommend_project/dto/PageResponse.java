package card_recommend_project.card_recommend_project.dto;

import java.util.List;

public record PageResponse(
        int totalPages,
        Long totalCount,
        int currentPage,
        int pageSize,
        List<CardResponse> cardResponse
) {
}
