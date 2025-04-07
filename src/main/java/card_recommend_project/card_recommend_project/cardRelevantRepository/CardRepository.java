package card_recommend_project.card_recommend_project.cardRelevantRepository;

import card_recommend_project.card_recommend_project.card.Card;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CardRepository extends JpaRepository<Card,Long> {
}
