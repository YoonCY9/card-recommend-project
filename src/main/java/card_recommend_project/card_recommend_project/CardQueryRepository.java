package card_recommend_project.card_recommend_project;

import com.querydsl.core.types.Predicate;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.NoSuchElementException;

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
                .where(
                        //월사용액 필터
                        filterCardsBySpending(record)
                )
                .fetch();
    }

    private BooleanExpression filterCardsBySpending(Integer record) {
        if (record == null) {
            return null;
        }
        switch (record) {
            case 30:
                return card.cardRecord.loe(300000);
            case 50:
                return card.cardRecord.loe(500000);
            case 51:
                return card.cardRecord.gt(500000);
            default:
                return null;
        }
    }

}
