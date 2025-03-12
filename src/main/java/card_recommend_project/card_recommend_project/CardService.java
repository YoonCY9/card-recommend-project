package card_recommend_project.card_recommend_project;

import card_recommend_project.card_recommend_project.dto.CardBenefitResponse;
import card_recommend_project.card_recommend_project.dto.CardDetailResponse;
import card_recommend_project.card_recommend_project.dto.CardResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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


    public List<CardResponse> findAll(List<String> cardBrand, int record, int fee, List<Category> benefit) {

         return cardQueryRepository.findAll(cardBrand, record, fee, benefit)
                 .stream()
                 .map(c -> new CardResponse(
                         c.getId(),
                         c.getCardName(),
                         c.getCardImg(),
                         c.getCardBenefits()
                                 .stream()
                                 .map(b-> b.getBnfContent())
                                 .toList(),
                         c.getCardRecord()))
                 .toList();
    }

    public CardDetailResponse findById(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new NoSuchElementException("카드가 없습니다."));
        return null;
    }
}
