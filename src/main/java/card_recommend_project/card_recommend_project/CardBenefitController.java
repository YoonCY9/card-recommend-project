package card_recommend_project.card_recommend_project;

import card_recommend_project.card_recommend_project.dto.CardBenefitResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CardBenefitController {

    private final CardBenefitService cardBenefitService;

    public CardBenefitController(CardBenefitService cardBenefitService) {
        this.cardBenefitService = cardBenefitService;
    }

    @PostMapping("/cardbenefit")
    public CardBenefitResponse create(@RequestBody CardBenefitRequest cardBenefitRequest) {
        return cardBenefitService.create(cardBenefitRequest);
    }
}