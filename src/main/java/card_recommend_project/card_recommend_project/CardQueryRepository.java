package card_recommend_project.card_recommend_project;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CardQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;
    private final QCard card = QCard.card;
    private final QOffer offer=QOffer.offer;

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
                        findByFee(fee != null ? String.valueOf(fee) : null)
                )
                .fetch();
    }

    private BooleanExpression findByFee(String feeStatus){
        if(feeStatus==null){
            return null;
        }
        if(feeStatus.equals("~30000")){
            return card.domesticOffer.amount.loe(30000).and(card.overseasOffer.amount.loe(30000));
        }
        if(feeStatus.equals("~50000")){
            return card.domesticOffer.amount.loe(50000).and(card.overseasOffer.amount.loe(50000));
        }
        else {
            return card.domesticOffer.amount.gt(50000).and(card.overseasOffer.amount.gt(50000));
        }

    }

}
