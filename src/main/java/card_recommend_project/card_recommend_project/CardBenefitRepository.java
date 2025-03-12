package card_recommend_project.card_recommend_project;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CardBenefitRepository extends JpaRepository<CardBenefit, Long> {
    List<CardBenefit> findByCardId_Id(Long cardId);
}
