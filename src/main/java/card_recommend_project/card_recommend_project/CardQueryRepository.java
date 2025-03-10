package card_recommend_project.card_recommend_project;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class CardQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;
    private final QCard card = QCard.card;

    public CardQueryRepository(JPAQueryFactory jpaQueryFactory) {
        this.jpaQueryFactory = jpaQueryFactory;
    }


    public List<Card> findAll(
        List<String> cardBrand,
        Integer record,
        Integer fee,
        List<String> benefit
    ) {
        return jpaQueryFactory
                .selectFrom(card)
                .where()
                .fetch();
    }

    public List<BooleanExpression> findByKeyWord(List<String> cardBrands) {
        if (cardBrands == null) {
            return null;
        }
        return cardBrands.stream()
                .map(cardBrand -> card.cardBrand.eq(cardBrand))
                .toList();
    }
}
