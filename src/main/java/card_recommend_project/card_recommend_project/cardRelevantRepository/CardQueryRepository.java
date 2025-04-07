package card_recommend_project.card_recommend_project.cardRelevantRepository;

import card_recommend_project.card_recommend_project.card.Card;
import card_recommend_project.card_recommend_project.card.QCard;
import card_recommend_project.card_recommend_project.cardBenefit.Category;
import card_recommend_project.card_recommend_project.cardBenefit.QOffer;
import card_recommend_project.card_recommend_project.entity.QCardBenefit;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CardQueryRepository {

    private final JPAQueryFactory jpaQueryFactory;
    private final QCard card = QCard.card;
    private final QOffer offer=QOffer.offer;
    private final QCardBenefit cardBenefit = QCardBenefit.cardBenefit;

    public CardQueryRepository(JPAQueryFactory jpaQueryFactory) {
        this.jpaQueryFactory = jpaQueryFactory;
    }


    public List<Card> findAll(
            List<String> cardBrands,
            Integer record,
            Integer fee,
            List<Category> benefit,
            List<Long> cardId,
            Pageable pageable,
            String keyward
    ) {
        return jpaQueryFactory
                .selectFrom(card)
                .where(
                        //월사용액 필터
                        filterCardsBySpending(record),
                        cardBrand(cardBrands),
                        findByFee(fee),
                        hasBenefitCategories(benefit),
                        findByCardId(cardId),
                        findByKeyWard(keyward)
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();
    }

    // 전체 카드 개수 조회
    public long countTotal() {
        Long count = jpaQueryFactory
                .select(card.count())
                .from(card)
                .fetchOne();
        return count != null ? count : 0L;
    }

    // 필터링된 카드 개수 조회
    public long countFiltered(
            List<String> cardBrands,
            Integer record,
            Integer fee,
            List<Category> benefit,
            List<Long> cardId
    ) {
        Long count = jpaQueryFactory
                .select(card.count())
                .from(card)
                .where(
                        filterCardsBySpending(record),
                        cardBrand(cardBrands),
                        findByFee(fee),
                        hasBenefitCategories(benefit),
                        findByCardId(cardId)
                )
                .fetchOne();
        return count != null ? count : 0L;
    }

  private BooleanExpression filterCardsBySpending(Integer record) {
        if (record == null) {
            return null;
        }
        return card.cardRecord.loe(record);
    }
  
    private BooleanExpression findByFee(Integer fee){
        if(fee==null){
            return null;
        }
        return card.domesticOffer.amount.loe(fee).or(card.overseasOffer.amount.loe(fee));


    }

    public BooleanExpression cardBrand(List<String> cardBrands) {
        if (cardBrands == null) {
            return null;
        }
        BooleanExpression expression = null;
        for (String brand : cardBrands) {
            BooleanExpression likeExpression = card.cardBrand.containsIgnoreCase(brand);
            expression = (expression == null) ? likeExpression : expression.or(likeExpression);
        }
        return expression;
    }

    private BooleanExpression hasBenefitCategories(List<Category> benefit) {
        if (benefit == null || benefit.isEmpty()) {
            return null;
        }

        // 모든 benefit이 cardBenefit에 존재해야 하므로, 각각의 benefit에 대해 서브쿼리를 작성
        BooleanExpression condition = Expressions.asBoolean(true).isTrue(); // 기본값 true
        for (Category category : benefit) {
            condition = condition.and(
                    card.id.in(
                            JPAExpressions.select(cardBenefit.cardId.id)
                                    .from(cardBenefit)
                                    .where(cardBenefit.bnfName.eq(category)) // 각 category에 대해 검증
                    )
            );
        }
        return condition;
    }

    private BooleanExpression findByCardId(List<Long> cardIds) {
        if (cardIds == null || cardIds.isEmpty()) {
            return null;
        }

        return card.id.in(cardIds);
    }

    // 카드제목으로 검색하기
    private BooleanExpression findByKeyWard(String keyWard) {
        if (keyWard == null) {
            return null;
        }
        return card.cardName.contains(keyWard);
    }

}
