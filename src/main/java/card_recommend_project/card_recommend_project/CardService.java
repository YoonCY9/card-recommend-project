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

    public CardService(CardRepository cardRepository, CardQueryRepository cardQueryRepository, CardBenefitRepository cardBenefitRepository) {
        this.cardRepository = cardRepository;
        this.cardQueryRepository = cardQueryRepository;
        this.cardBenefitRepository = cardBenefitRepository;
    }

    private final CardRepository cardRepository;
    private final CardQueryRepository cardQueryRepository;
    private final CardBenefitRepository cardBenefitRepository;



    public List<CardResponse> findAll(List<String> cardBrand, Integer record, Integer fee, List<Category> benefit) {

         return cardQueryRepository.findAll(cardBrand, record, fee, benefit)
                 .stream()
                 .map(c -> new CardResponse(
                         c.getId(),
                         c.getCardName(),
                         c.getCardImg(),
                         cardBenefitRepository.findByCardId_Id(c.getId()).stream().map(b -> b.getBnfContent()).toList(),
                         c.getCardRecord(),
                         c.getCardBrand()
                        ))
                 .toList();
    }

    public CardDetailResponse findById(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new NoSuchElementException("카드가 없습니다."));
        return null;
    }
}
