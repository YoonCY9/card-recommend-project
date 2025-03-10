package card_recommend_project.card_recommend_project;

import card_recommend_project.card_recommend_project.dto.CardDetailResponse;
import card_recommend_project.card_recommend_project.dto.CardResponse;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CardService {

    public CardService(CardRepository cardRepository, CardQueryRepository cardQueryRepository) {
        this.cardRepository = cardRepository;
        this.cardQueryRepository = cardQueryRepository;
    }

    private final CardRepository cardRepository;
    private final CardQueryRepository cardQueryRepository;


    public List<CardResponse> findAll(List<String> cardBrand, int record, int fee, List<String> benefit) {
        return null;
        /*cardQueryRepository.findAll()
                .stream()
                .map(card -> new CardResponse())
                .toList();*/
    }

    public CardDetailResponse findById(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new NoSuchElementException("카드가 없습니다."));
        return null;
    }
}
