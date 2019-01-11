import CategoryHelper from "../Components/Categories/CategoryHelper";

const checkDateRange = (fromDate, toDate, date) => {
    // nothing to check so always valid
    if (fromDate === null && toDate === null) return true;

    // turn date into object
    const dateObject = new Date(date);
    const time = dateObject.getTime();

    if (fromDate !== null) {
        if (time < fromDate.getTime()) {
            // outside from range
            return false;
        }
    }
    if (toDate !== null) {
        if (time > toDate.getTime()) {
            // outside to range
            return false;
        }
    }

    return true;
};

/**
 * Filters out payments we don't need. E.G. Payment objects with a MASTERCARD type
 * @param payment
 */
export const paymentApiFilter = payment => {
    if (payment.type && payment.type === "MASTERCARD") {
        return false;
    }
    return true;
};

export const eventFilter = options => event => {
    switch (event.type) {
        case "Payment":
        case "ScheduledInstance":
        case "ScheduledPayment":
            let paymentObject = event.object;
            if (event.type === "ScheduledInstance") {
                paymentObject = event.object.result_object;
            }
            if (event.type === "ScheduledPayment") {
                paymentObject = event.object.payment;
            }
            return paymentFilter(options)(paymentObject);
        case "Invoice":
            return invoiceFilter(options)(event.object);
        case "BunqMeFundraiserResult":
            return bunqMeFundraiserResultFilter(options)(event.object);
        case "IdealMerchantTransaction":
            return idealMerchantTransactionFilter(options)(event.object);
        case "BunqMeTab":
            return bunqMeTabsFilter(options)(event.object);
        case "MasterCardAction":
            return masterCardActionFilter(options)(event.object);
        case "RequestResponse":
            return requestResponseFilter(options)(event.object);
        case "RequestInquiry":
            return requestInquiryFilter(options)(event.object);
        case "RequestInquiryBatch":
            return requestInquiryBatchFilter(options)(event.object);
        case "ShareInviteBankResponse":
            return shareInviteBankResponseFilter(options)(event.object);
        case "ShareInviteBankInquiry":
            return shareInviteBankInquiryFilter(options)(event.object);
    }

    return checkDateRange(options.dateFromFilter, options.dateToFilter, event.created);
};

export const idealMerchantTransactionFilter = options => idealMerchantTransaction => {
    if (options.paymentVisibility === false) {
        return false;
    }

    if (options.paymentType) {
        if (options.paymentType === "received") {
            return false;
        } else if (options.paymentType === "sent") {
            return true;
        }
    }

    if (options.searchTerm && options.searchTerm.length > 0) {
        const searchMatches = [
            idealMerchantTransaction.transaction_identifier.toLowerCase(),
            idealMerchantTransaction.purchase_identifier.toLowerCase(),
            idealMerchantTransaction.alias.iban.toLowerCase(),
            idealMerchantTransaction.alias.display_name.toLowerCase(),
            idealMerchantTransaction.counterparty_alias.display_name.toLowerCase()
        ].some(text => text.includes(options.searchTerm));
        if (!searchMatches) return false;
    }

    if (options.amountFilterAmount !== "") {
        let amountValue = idealMerchantTransaction.getAmount();
        if (amountValue < 0) amountValue = amountValue * -1;

        switch (options.amountFilterType) {
            case "EQUALS":
                if (amountValue != options.amountFilterAmount) return false;
                break;
            case "MORE":
                if (amountValue < options.amountFilterAmount) return false;
                break;
            case "LESS":
                if (amountValue > options.amountFilterAmount) return false;
                break;
        }
    }

    if (options.selectedCategories && options.categories && options.categoryConnections) {
        if (options.selectedCategories.length > 0) {
            const categories = CategoryHelper(
                options.categories,
                options.categoryConnections,
                "IdealMerchantTransaction",
                idealMerchantTransaction.id
            );

            // no categories linked so always unmatched
            if (categories.length === 0) {
                if (!options.toggleCategoryFilter) return false;
            }

            // go through the connected categories and selected categories to see if one matches
            const categoryMatches = categories.some(category => {
                return options.selectedCategories.some(selectedCategory => {
                    return category.id === selectedCategory;
                });
            });

            // if reversed and we got matches, return false
            if (options.toggleCategoryFilter && categoryMatches) return false;

            // no matches and not reversed so return false
            if (!categoryMatches) {
                if (!options.toggleCategoryFilter) return false;
            }
        }
    }

    if (options.selectedAccountIds) {
        if (options.selectedAccountIds.length > 0) {
            // check if the idealMerchantTransaction is connected to a selected account
            const foundIndex = options.selectedAccountIds.findIndex(
                selectedAccountId => selectedAccountId === idealMerchantTransaction.monetary_account_id
            );

            // if true only return true if account id is in the filter, else return false
            return options.toggleAccountIds === false ? foundIndex > -1 : foundIndex === -1;
        }
    }

    return checkDateRange(options.dateFromFilter, options.dateToFilter, idealMerchantTransaction.created);
};

export const invoiceFilter = options => invoice => {
    if (options.paymentVisibility === false) {
        return false;
    }

    if (options.paymentType) {
        if (options.paymentType === "received") {
            return false;
        } else if (options.paymentType === "sent") {
            return true;
        }
    }

    if (options.searchTerm && options.searchTerm.length > 0) {
        const searchMatches = [
            invoice.vat_number.toLowerCase(),
            invoice.alias.iban.toLowerCase(),
            invoice.alias.display_name.toLowerCase(),
            invoice.counterparty_alias.display_name.toLowerCase()
        ].some(text => text.includes(options.searchTerm));
        if (!searchMatches) return false;
    }

    if (options.amountFilterAmount !== "") {
        let amountValue = invoice.getAmount();
        if (amountValue < 0) amountValue = amountValue * -1;

        switch (options.amountFilterType) {
            case "EQUALS":
                if (amountValue != options.amountFilterAmount) return false;
                break;
            case "MORE":
                if (amountValue < options.amountFilterAmount) return false;
                break;
            case "LESS":
                if (amountValue > options.amountFilterAmount) return false;
                break;
        }
    }

    if (options.selectedCategories && options.categories && options.categoryConnections) {
        if (options.selectedCategories.length > 0) {
            const categories = CategoryHelper(options.categories, options.categoryConnections, "Invoice", invoice.id);

            // no categories linked so always unmatched
            if (categories.length === 0) {
                if (!options.toggleCategoryFilter) return false;
            }

            // go through the connected categories and selected categories to see if one matches
            const categoryMatches = categories.some(category => {
                return options.selectedCategories.some(selectedCategory => {
                    return category.id === selectedCategory;
                });
            });

            // if reversed and we got matches, return false
            if (options.toggleCategoryFilter && categoryMatches) return false;

            // no matches and not reversed so return false
            if (!categoryMatches) {
                if (!options.toggleCategoryFilter) return false;
            }
        }
    }

    if (options.selectedAccountIds) {
        if (options.selectedAccountIds.length > 0) {
            // check if the invoice is connected to a selected account
            const foundIndex = options.selectedAccountIds.findIndex(
                selectedAccountId => selectedAccountId === invoice.monetary_account_id
            );

            // if true only return true if account id is in the filter, else return false
            return options.toggleAccountIds === false ? foundIndex > -1 : foundIndex === -1;
        }
    }

    return checkDateRange(options.dateFromFilter, options.dateToFilter, invoice.created);
};

export const paymentFilter = options => payment => {
    if (options.paymentVisibility === false) {
        return false;
    }
    // hide mastercard payments
    if (payment.type === "MASTERCARD") {
        return false;
    }

    // hide payments linkd to an accepted request
    if (payment.sub_type === "REQUEST" && options.displayRequestPayments === false) {
        return false;
    }

    if (options.paymentType) {
        if (options.paymentType === "received") {
            if (payment.amount.value <= 0) {
                return false;
            }
        } else if (options.paymentType === "sent") {
            if (payment.amount.value >= 0) {
                return false;
            }
        }
    }

    if (options.selectedCardIds && options.selectedCardIds.length > 0) {
        return false;
    }

    if (options.searchTerm && options.searchTerm.length > 0) {
        const searchMatches = [
            payment.description.toLowerCase(),
            payment.alias.iban.toLowerCase(),
            payment.alias.display_name.toLowerCase(),
            payment.counterparty_alias.display_name.toLowerCase()
        ].some(text => text.includes(options.searchTerm));
        if (!searchMatches) return false;
    }

    if (options.amountFilterAmount !== "") {
        let amountValue = payment.getAmount();
        if (amountValue < 0) amountValue = amountValue * -1;

        switch (options.amountFilterType) {
            case "EQUALS":
                if (amountValue != options.amountFilterAmount) return false;
                break;
            case "MORE":
                if (amountValue < options.amountFilterAmount) return false;
                break;
            case "LESS":
                if (amountValue > options.amountFilterAmount) return false;
                break;
        }
    }

    if (options.selectedCategories && options.categories && options.categoryConnections) {
        if (options.selectedCategories.length > 0) {
            const categories = CategoryHelper(options.categories, options.categoryConnections, "Payment", payment.id);

            // no categories linked so always unmatched
            if (categories.length === 0) {
                if (!options.toggleCategoryFilter) return false;
            }

            // go through the connected categories and selected categories to see if one matches
            const categoryMatches = categories.some(category => {
                return options.selectedCategories.some(selectedCategory => {
                    return category.id === selectedCategory;
                });
            });

            // if reversed and we got matches, return false
            if (options.toggleCategoryFilter && categoryMatches) return false;

            // no matches and not reversed so return false
            if (!categoryMatches) {
                if (!options.toggleCategoryFilter) return false;
            }
        }
    }

    if (options.selectedAccountIds) {
        if (options.selectedAccountIds.length > 0) {
            // check if the payment is connected to a selected account
            const foundIndex = options.selectedAccountIds.findIndex(
                selectedAccountId => selectedAccountId === payment.monetary_account_id
            );

            // if true only return true if account id is in the filter, else return false
            return options.toggleAccountIds === false ? foundIndex > -1 : foundIndex === -1;
        }
    }

    return checkDateRange(options.dateFromFilter, options.dateToFilter, payment.created);
};

export const bunqMeTabsFilter = options => bunqMeTab => {
    if (options.bunqMeTabVisibility === false) {
        return false;
    }

    const dateCheck = checkDateRange(options.dateFromFilter, options.dateToFilter, bunqMeTab.BunqMeTab.created);
    if (!dateCheck) return false;

    if (options.searchTerm && options.searchTerm.length > 0) {
        const searchMatches = [bunqMeTab.bunqme_tab_entry.description.toLowerCase()].some(text =>
            text.includes(options.searchTerm)
        );
        if (!searchMatches) return false;
    }

    // don't show bunqme requests if amount filter is set
    if (options.amountFilterAmount !== "") return false;

    if (options.selectedCardIds && options.selectedCardIds.length > 0) {
        return false;
    }

    if (options.selectedCategories && options.categories && options.categoryConnections) {
        if (options.selectedCategories.length > 0) {
            const categories = CategoryHelper(
                options.categories,
                options.categoryConnections,
                "BunqMeTab",
                bunqMeTab.id
            );

            // no categories linked so always unmatched
            if (categories.length === 0) {
                if (!options.toggleCategoryFilter) return false;
            }

            // go through the connected categories and selected categories to see if one matches
            const categoryMatches = categories.some(category => {
                return options.selectedCategories.some(selectedCategory => {
                    return category.id === selectedCategory;
                });
            });

            // if reversed and we got matches, return false
            if (options.toggleCategoryFilter && categoryMatches) return false;

            // no matches and not reversed so return false
            if (!categoryMatches) {
                if (!options.toggleCategoryFilter) return false;
            }
        }
    }

    if (options.selectedAccountIds) {
        if (options.selectedAccountIds.length > 0) {
            // check if the payment is connected to a selected account
            const foundIndex = options.selectedAccountIds.findIndex(
                selectedAccountId => selectedAccountId === bunqMeTab.monetary_account_id
            );

            // if true only return true if account id is in the filter, else return false
            return options.toggleAccountIds === false ? foundIndex > -1 : foundIndex === -1;
        }
    }

    switch (options.bunqMeTabType) {
        case "active":
            return bunqMeTab.BunqMeTab.status === "WAITING_FOR_PAYMENT";
        case "cancelled":
            return bunqMeTab.BunqMeTab.status === "CANCELLED";
        case "expired":
            return bunqMeTab.BunqMeTab.status === "EXPIRED";
    }

    return true;
};

export const masterCardActionFilter = options => masterCardAction => {
    if (options.paymentVisibility === false) {
        return false;
    }

    if (options.paymentType === "received") {
        return false;
    }

    if (options.searchTerm && options.searchTerm.length > 0) {
        const searchMatches = [
            masterCardAction.description.toLowerCase(),
            masterCardAction.alias.display_name.toLowerCase(),
            masterCardAction.counterparty_alias.display_name.toLowerCase()
        ].some(text => text.includes(options.searchTerm));
        if (!searchMatches) return false;
    }

    if (options.amountFilterAmount !== "") {
        const amountValue = masterCardAction.getAmount();
        switch (options.amountFilterType) {
            case "EQUALS":
                if (amountValue != options.amountFilterAmount) return false;
                break;
            case "MORE":
                if (amountValue < options.amountFilterAmount) return false;
                break;
            case "LESS":
                if (amountValue > options.amountFilterAmount) return false;
                break;
        }
    }

    if (options.selectedCategories && options.categories && options.categoryConnections) {
        if (options.selectedCategories.length > 0) {
            const categories = CategoryHelper(
                options.categories,
                options.categoryConnections,
                "MasterCardAction",
                masterCardAction.id
            );

            // no categories linked so always unmatched
            if (categories.length === 0) return options.toggleCategoryFilter;

            // go through the connected categories and selected categories to see if one matches
            const categoryMatches = categories.some(category => {
                return options.selectedCategories.some(selectedCategory => {
                    return category.id === selectedCategory;
                });
            });

            if (options.toggleCategoryFilter === true && categoryMatches === true) {
                return false;
            } else if (options.toggleCategoryFilter === false && categoryMatches === false) {
                return false;
            }
        }
    }

    if (options.selectedCardIds && options.selectedCardIds.length > 0) {
        // check if the payment is connected to a selected account
        const foundIndex = options.selectedCardIds.findIndex(
            selectedCardId => selectedCardId === masterCardAction.card_id
        );

        // if true only return true if account id is in the filter, else return false
        return options.toggleCardIds === false ? foundIndex > -1 : foundIndex === -1;
    }

    if (options.selectedAccountIds && options.selectedAccountIds.length > 0) {
        // check if the payment is connected to a selected account
        const foundIndex = options.selectedAccountIds.findIndex(
            selectedAccountId => selectedAccountId === masterCardAction.monetary_account_id
        );

        // if true only return true if account id is in the filter, else return false
        return options.toggleAccountIds === false ? foundIndex > -1 : foundIndex === -1;
    }

    return checkDateRange(options.dateFromFilter, options.dateToFilter, masterCardAction.MasterCardAction.created);
};

export const requestResponseFilter = options => requestResponse => {
    // check if this is a internal request or a payment E.G. ideal payments
    const requestTypes = ["INTERNAL", "DIRECT_DEBIT", "DIRECT_DEBIT_B2B"];
    const isRequestType = requestTypes.includes(requestResponse.type);

    if (isRequestType) {
        if (options.requestVisibility === false) {
            return false;
        }
    } else {
        if (options.paymentVisibility === false) {
            return false;
        }
    }

    // hide accepted payments
    if (requestResponse.RequestResponse.status === "ACCEPTED" && options.displayAcceptedRequests !== true) {
        return false;
    }

    if (isRequestType) {
        // check payment type since this is a payment
        if (options.requestType !== "sent" && options.requestType !== "default") {
            return false;
        }
    } else {
        // check the request type since this is an actual request
        if (options.requestType !== "sent" && options.requestType !== "default") {
            return false;
        }
    }

    if (options.searchTerm && options.searchTerm.length > 0) {
        const searchMatches = [
            requestResponse.description.toLowerCase(),
            requestResponse.alias.display_name.toLowerCase(),
            requestResponse.counterparty_alias.display_name.toLowerCase()
        ].some(text => text.includes(options.searchTerm));
        if (!searchMatches) return false;
    }

    if (options.selectedCardIds && options.selectedCardIds.length > 0) {
        return false;
    }

    if (options.amountFilterAmount !== "") {
        let amountValue = requestResponse.getAmount();
        if (amountValue < 0) amountValue = amountValue * -1;

        switch (options.amountFilterType) {
            case "EQUALS":
                if (amountValue != options.amountFilterAmount) return false;
                break;
            case "MORE":
                if (amountValue < options.amountFilterAmount) return false;
                break;
            case "LESS":
                if (amountValue > options.amountFilterAmount) return false;
                break;
        }
    }

    if (options.selectedCategories && options.categories && options.categoryConnections) {
        if (options.selectedCategories.length > 0) {
            const categories = CategoryHelper(
                options.categories,
                options.categoryConnections,
                "RequestResponse",
                requestResponse.id
            );

            // no categories linked so always unmatched
            if (categories.length === 0) {
                if (!options.toggleCategoryFilter) return false;
            }

            // go through the connected categories and selected categories to see if one matches
            const categoryMatches = categories.some(category => {
                return options.selectedCategories.some(selectedCategory => {
                    return category.id === selectedCategory;
                });
            });

            // if reversed and we got matches, return false
            if (options.toggleCategoryFilter && categoryMatches) return false;

            // no matches and not reversed so return false
            if (!categoryMatches) {
                if (!options.toggleCategoryFilter) return false;
            }
        }
    }

    if (options.selectedAccountIds) {
        if (options.selectedAccountIds.length > 0) {
            // check if the payment is connected to a selected account
            const foundIndex = options.selectedAccountIds.findIndex(
                selectedAccountId => selectedAccountId === requestResponse.monetary_account_id
            );

            // if true only return true if account id is in the filter, else return false
            return options.toggleAccountIds === false ? foundIndex > -1 : foundIndex === -1;
        }
    }

    return checkDateRange(options.dateFromFilter, options.dateToFilter, requestResponse.RequestResponse.updated);
};

export const requestInquiryFilter = options => requestInquiry => {
    if (options.requestVisibility === false) {
        return false;
    }

    if (requestInquiry.RequestInquiry.status === "ACCEPTED" && options.displayAcceptedRequests !== true) {
        return false;
    }

    if (options.requestType !== "received" && options.requestType !== "default") {
        return false;
    }

    if (options.searchTerm && options.searchTerm.length > 0) {
        const searchMatches = [
            requestInquiry.description.toLowerCase(),
            requestInquiry.counterparty_alias.display_name.toLowerCase()
        ].some(text => text.includes(options.searchTerm));
        if (!searchMatches) return false;
    }

    if (options.amountFilterAmount !== "") {
        let amountValue = requestInquiry.getAmount();
        if (amountValue < 0) amountValue = amountValue * -1;

        switch (options.amountFilterType) {
            case "EQUALS":
                if (amountValue != options.amountFilterAmount) return false;
                break;
            case "MORE":
                if (amountValue < options.amountFilterAmount) return false;
                break;
            case "LESS":
                if (amountValue > options.amountFilterAmount) return false;
                break;
        }
    }

    if (options.selectedCardIds && options.selectedCardIds.length > 0) {
        return false;
    }

    if (options.selectedCategories && options.categories && options.categoryConnections) {
        if (options.selectedCategories.length > 0) {
            const categories = CategoryHelper(
                options.categories,
                options.categoryConnections,
                "RequestInquiry",
                requestInquiry.id
            );

            // no categories linked so always unmatched
            if (categories.length === 0) {
                if (!options.toggleCategoryFilter) return false;
            }

            // go through the connected categories and selected categories to see if one matches
            const categoryMatches = categories.some(category => {
                return options.selectedCategories.some(selectedCategory => {
                    return category.id === selectedCategory;
                });
            });

            // if reversed and we got matches, return false
            if (options.toggleCategoryFilter && categoryMatches) return false;

            // no matches and not reversed so return false
            if (!categoryMatches) {
                if (!options.toggleCategoryFilter) return false;
            }
        }
    }

    if (options.selectedAccountIds) {
        if (options.selectedAccountIds.length > 0) {
            // check if the payment is connected to a selected account
            const foundIndex = options.selectedAccountIds.findIndex(
                selectedAccountId => selectedAccountId === requestInquiry.monetary_account_id
            );

            // if true only return true if account id is in the filter, else return false
            return options.toggleAccountIds === false ? foundIndex > -1 : foundIndex === -1;
        }
    }

    return checkDateRange(options.dateFromFilter, options.dateToFilter, requestInquiry.RequestInquiry.updated);
};

export const requestInquiryBatchFilter = options => requestInquiryBatch => {
    if (options.requestVisibility === false) {
        return false;
    }

    if (options.requestType !== "received" && options.requestType !== "default") {
        return false;
    }

    if (options.searchTerm && options.searchTerm.length > 0) {
        return false;
    }

    // don't show requests if amount filter is set
    if (options.amountFilterAmount !== "") return false;

    if (options.selectedCardIds && options.selectedCardIds.length > 0) {
        return false;
    }

    if (options.selectedAccountIds) {
        if (options.selectedAccountIds.length > 0) {
            // TODO check underlying request inquiry account ids
            return false;
        }
    }

    return checkDateRange(
        options.dateFromFilter,
        options.dateToFilter,
        requestInquiryBatch.RequestInquiryBatch.updated
    );
};

export const bunqMeFundraiserResultFilter = options => bunqMeFundraiserResult => {
    if (options.paymentVisibility === false) return false;

    if (options.searchTerm && options.searchTerm.length > 0) return false;

    if (options.amountFilterAmount !== "") return false;

    if (options.selectedCardIds && options.selectedCardIds.length > 0) return false;

    if (options.selectedCategories && options.categories && options.categoryConnections) {
        if (options.selectedCategories.length > 0) return false;
    }

    if (options.selectedAccountIds) {
        if (options.selectedAccountIds.length > 0) {
            // TODO check underlying request inquiry account ids
            return false;
        }
    }

    const dateCheck = checkDateRange(
        options.dateFromFilter,
        options.dateToFilter,
        bunqMeFundraiserResult.BunqMeFundraiserResult.updated
    );
    if (!dateCheck) return false;

    return true;
};

export const shareInviteBankResponseFilter = options => shareInviteBankResponse => {
    const shareInviteBankResponseInfo = shareInviteBankResponse.ShareInviteBankResponse;

    if (shareInviteBankResponseInfo.status !== "PENDING") {
        return false;
    }

    if (options.requestVisibility === false) {
        return false;
    }

    // don't show share invites if amount filter is set
    if (options.amountFilterAmount !== "") return false;

    // hide these if any type of filter is set
    if (options.searchTerm && options.searchTerm.length > 0) {
        return false;
    }
    if (
        options.selectedCategories &&
        options.categories &&
        options.categoryConnections &&
        options.selectedCategories.length > 0
    ) {
        return false;
    }

    if (options.selectedCardIds && options.selectedCardIds.length > 0) {
        return false;
    }

    if (options.selectedAccountIds && options.selectedAccountIds.length > 0) {
        if (!shareInviteBankResponseInfo.monetary_account_id) return false;

        // check if the payment is connected to a selected account
        const foundIndex = options.selectedAccountIds.findIndex(
            selectedAccountId => selectedAccountId === shareInviteBankResponseInfo.monetary_account_id
        );

        // if true only return true if account id is in the filter, else return false
        return options.toggleAccountIds === false ? foundIndex > -1 : foundIndex === -1;
    }

    if (options.bunqMeTabType !== "default" || options.paymentType !== "default" || options.requestType !== "default") {
        return false;
    }

    return checkDateRange(options.dateFromFilter, options.dateToFilter, shareInviteBankResponseInfo.updated);
};

export const shareInviteBankInquiryFilter = options => shareInviteBankInquiry => {
    const shareInviteBankInquiryInfo = shareInviteBankInquiry.ShareInviteBankInquiry
        ? shareInviteBankInquiry.ShareInviteBankInquiry
        : shareInviteBankInquiry.ShareInviteBankResponse;

    if (shareInviteBankInquiryInfo.status !== "PENDING") {
        return false;
    }

    if (options.requestVisibility === false) {
        return false;
    }

    // hide these if any type of filter is set
    if (options.searchTerm && options.searchTerm.length > 0) {
        return false;
    }

    // don't show share invites if amount filter is set
    if (options.amountFilterAmount !== "") return false;

    if (options.selectedCardIds && options.selectedCardIds.length > 0) {
        return false;
    }

    if (
        options.selectedCategories &&
        options.categories &&
        options.categoryConnections &&
        options.selectedCategories.length > 0
    ) {
        return false;
    }

    if (options.selectedAccountIds && options.selectedAccountIds.length > 0) {
        // check if the payment is connected to a selected account
        const foundIndex = options.selectedAccountIds.findIndex(
            selectedAccountId => selectedAccountId === shareInviteBankInquiryInfo.monetary_account_id
        );

        // if true only return true if account id is in the filter, else return false
        return options.toggleAccountIds === false ? foundIndex > -1 : foundIndex === -1;
    }

    if (options.bunqMeTabType !== "default" || options.paymentType !== "default" || options.requestType !== "default") {
        return false;
    }

    return checkDateRange(options.dateFromFilter, options.dateToFilter, shareInviteBankInquiryInfo.updated);
};

export const filterShareInviteBankResponses = (accountId, statusList = ["ACCEPTED"]) => shareInviteBankResponse => {
    if (!shareInviteBankResponse.ShareInviteBankResponse) return false;

    return (
        statusList.includes(shareInviteBankResponse.ShareInviteBankResponse.status) &&
        shareInviteBankResponse.ShareInviteBankResponse.monetary_account_id === accountId
    );
};

export const filterShareInviteBankInquiries = (accountId, statusList = ["ACCEPTED"]) => shareInviteBankInquiry => {
    if (shareInviteBankInquiry.ShareInviteBankInquiry) {
        return (
            statusList.includes(shareInviteBankInquiry.ShareInviteBankInquiry.status) &&
            shareInviteBankInquiry.ShareInviteBankInquiry.monetary_account_id === accountId
        );
    } else if (shareInviteBankInquiry.ShareInviteBankResponse) {
        return (
            statusList.includes(shareInviteBankInquiry.ShareInviteBankResponse.status) &&
            shareInviteBankInquiry.ShareInviteBankResponse.monetary_account_id === accountId
        );
    }
    return false;
};
