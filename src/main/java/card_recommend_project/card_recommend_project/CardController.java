package card_recommend_project.card_recommend_project;

import card_recommend_project.card_recommend_project.dto.CardDetailResponse;
import card_recommend_project.card_recommend_project.dto.CardResponse;
import card_recommend_project.card_recommend_project.dto.PageResponse;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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
                             @RequestParam(required = false)List<Category> benefit,
                             @RequestParam(defaultValue = "1") int page,
                             @RequestParam(defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page-1, size);
        return cardService.findAll(cardBrand,record,fee,benefit,pageable);
    }

    @GetMapping("/cards/{cardId}")
    public CardDetailResponse findById(@PathVariable Long cardId){
        return cardService.findById(cardId);
    }
}
