package card_recommend_project.card_recommend_project;

import card_recommend_project.card_recommend_project.dto.CardBenefitResponse;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class CardBenefitService {

    private final CardBenefitRepository cardBenefitRepository;
    private final CardRepository cardRepository;

    public CardBenefitService(CardBenefitRepository cardBenefitRepository, CardRepository cardRepository) {
        this.cardBenefitRepository = cardBenefitRepository;
        this.cardRepository = cardRepository;
    }

    @Transactional
    public CardBenefitResponse create(CardBenefitRequest request) {
        Card card = cardRepository.findById(request.cardId()).orElseThrow(
                () -> new NoSuchElementException("해당하는 카드가 없습니다."));
        CardBenefit cardBenefit = cardBenefitRepository.save(new CardBenefit(request.bnfName(), request.bnfContent(), request.bnfDetail(), card));
        return new CardBenefitResponse(
                cardBenefit.getBnfName(),
                cardBenefit.getBnfContent(),
                cardBenefit.getBnfDetail());
    }
}