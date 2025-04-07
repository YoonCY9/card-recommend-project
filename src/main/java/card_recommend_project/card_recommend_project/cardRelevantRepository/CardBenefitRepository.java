package card_recommend_project.card_recommend_project.cardRelevantRepository;

import card_recommend_project.card_recommend_project.card.Card;
import card_recommend_project.card_recommend_project.entity.CardBenefit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardBenefitRepository extends JpaRepository<CardBenefit, Long> {
    List<CardBenefit> findByCardId_Id(Long cardId);

    void deleteByCardId(Card card);
}
