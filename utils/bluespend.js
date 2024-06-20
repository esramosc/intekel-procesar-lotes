const apiURL = process.env.API_URL;

const createExpense = async (params) => {
    console.log('createExpense params: ', params);
    return 1;
}

const createExpenseDetail = async (params, expenseId) => {
    console.log('createExpenseDetail params: ', params);
    console.log('createExpenseDetail expenseId: ', expenseId);
    return true;
}

exports.createExpense = createExpense;
exports.createExpenseDetail = createExpenseDetail;
