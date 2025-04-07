package card_recommend_project.card_recommend_project.card;

import card_recommend_project.card_recommend_project.cardBenefit.Category;
import card_recommend_project.card_recommend_project.cardBenefit.Offer;
import card_recommend_project.card_recommend_project.cardRelevantRepository.CardBenefitRepository;
import card_recommend_project.card_recommend_project.cardRelevantRepository.CardQueryRepository;
import card_recommend_project.card_recommend_project.cardRelevantRepository.CardRepository;
import card_recommend_project.card_recommend_project.dto.*;
import card_recommend_project.card_recommend_project.entity.CardBenefit;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CardService {

    private final CardRepository cardRepository;
    private final CardQueryRepository cardQueryRepository;
    private final CardBenefitRepository cardBenefitRepository;

    public CardService(CardRepository cardRepository, CardQueryRepository cardQueryRepository, CardBenefitRepository cardBenefitRepository) {
        this.cardRepository = cardRepository;
        this.cardQueryRepository = cardQueryRepository;
        this.cardBenefitRepository = cardBenefitRepository;
    }

    public PageResponse findAll(List<String> cardBrand, Integer record, Integer fee, List<Category> benefit, List<Long> cardId, Pageable pageable, String keyward) {

        List<CardResponse> list = cardQueryRepository.findAll(cardBrand, record, fee, benefit, cardId, pageable, keyward)
                .stream()
                .map(c -> new CardResponse(
                        c.getId(),
                        c.getCardName(),
                        c.getCardImg(),
                        c.getSafeDomesticOfferAmount(),
                        c.getSafeOverseasOfferAmount(),
                        cardBenefitRepository.findByCardId_Id(c.getId()).stream().map(b -> b.getBnfContent()).toList(),
                        c.getCardRecord(),
                        c.getCardBrand()
                ))
                .toList();

        long totalCount = cardQueryRepository.countFiltered(cardBrand, record, fee, benefit, cardId);
        int totalPage = (int) Math.ceil((double) (totalCount - 1) / pageable.getPageSize()) + 1;
        return new PageResponse(
                totalPage,
                totalCount,
                pageable.getPageNumber(),
                pageable.getPageSize(),
                list
        );
    }


    public CardDetailResponse findById(Long cardId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new NoSuchElementException("카드가 없습니다."));
        List<CardBenefit> cardBenefits = cardBenefitRepository.findByCardId_Id(card.getId());
        List<CardBenefitResponse> cardBenefitResponses = cardBenefits.stream()
                .map(cardBenefit -> new CardBenefitResponse(
                        cardBenefit.getBnfName(),
                        cardBenefit.getBnfContent(),
                        cardBenefit.getBnfDetail()))
                .toList();

        return new CardDetailResponse(
                card.getId(),
                card.getCardName(),
                card.getCardBrand(),
                card.getCardImg(),
                card.getSafeDomesticOfferType(),
                card.getSafeDomesticOfferAmount(),
                card.getSafeOverseasOfferType(),
                card.getSafeOverseasOfferAmount(),
                card.getCardRecord(),
                card.getCardOverseas(),
                cardBenefitResponses);
    }

    public CardResponse create(CreateCardRequest cardRequest) {
        Card card = cardRepository.save(new Card(cardRequest.cardName(),
                cardRequest.cardBrand(),
                new Offer(cardRequest.Domestic(), cardRequest.domesticOfferAmount()),
                new Offer(cardRequest.Overseas(), cardRequest.overseasAmount()),
                cardRequest.cardImage(),
                cardRequest.record(),
                cardRequest.cardOverseas()));
        return new CardResponse(card.getId(),
                card.getCardName(),
                card.getCardImg(),
                card.getSafeDomesticOfferAmount(),
                card.getSafeOverseasOfferAmount(),
                null,
                cardRequest.record(),
                card.getCardBrand());
    }

    @Transactional
    public void delete(Long cardId) {
        Card card = cardRepository.findById(cardId).orElseThrow(
                () -> new NoSuchElementException("해당하는 카드가 존재하지 않습니다."));
        cardBenefitRepository.deleteByCardId(card);
        cardRepository.delete(card);
    }
}
