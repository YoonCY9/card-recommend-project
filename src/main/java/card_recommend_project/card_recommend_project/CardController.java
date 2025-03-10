package card_recommend_project.card_recommend_project;

import card_recommend_project.card_recommend_project.dto.CardDetailResponse;
import card_recommend_project.card_recommend_project.dto.CardResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @GetMapping("/cards")
    public List<CardResponse> read(){
        return cardService.findAll();
    }

    @GetMapping("/cards/{cardId}")
    public CardDetailResponse findById(@PathVariable Long cardId){
        return cardService.findById(cardId);
    }
}
