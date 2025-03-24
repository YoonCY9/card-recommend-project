package card_recommend_project.card_recommend_project;

import card_recommend_project.card_recommend_project.dto.CardDetailResponse;
import card_recommend_project.card_recommend_project.dto.CardResponse;
import card_recommend_project.card_recommend_project.dto.PageResponse;
import card_recommend_project.card_recommend_project.loginUtils.LoginMember;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping("/cards")
    public PageResponse read(@RequestParam(required = false) List<String> cardBrand,
                             @RequestParam(required = false) Integer record,
                             @RequestParam(required = false) Integer fee,
                             @RequestParam(required = false) List<Category> benefit,
                             @RequestParam(required = false) List<Long> cardId,
                             @RequestParam(defaultValue = "1") int page,
                             @RequestParam(defaultValue = "8") int size,
                             @RequestParam(required = false) String keyward) {
        Pageable pageable = PageRequest.of(page - 1, size);
        return cardService.findAll(cardBrand, record, fee, benefit, cardId, pageable,keyward);
    }

    @GetMapping("/cards/{cardId}")
    public CardDetailResponse findById(@PathVariable Long cardId) {
        return cardService.findById(cardId);
    }

    @PostMapping("/cards")
    public CardResponse create(@RequestBody CreateCardRequest cardRequest,
                               @LoginMember String loginId) {
        return cardService.create(cardRequest);
    }

    @DeleteMapping("/cards/{cardId}")
    public void delete(@PathVariable Long cardId,
                       @LoginMember String loginId) {
        cardService.delete(cardId);
    }
}
