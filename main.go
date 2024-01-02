package main

import (
	"fmt"
)

func performExchange(amount, exchangeRate float64, currency string, direct bool) map[string]float64 {
	brokerChargePercentage := 3.0
	var convertedAmount, brokerCharge, totalAmount float64

	convertedAmount = (amount * exchangeRate)
	brokerCharge = ((amount * brokerChargePercentage) / 100) * exchangeRate

	if !direct {
		convertedAmount = amount / exchangeRate
		brokerCharge = (amount * brokerChargePercentage) / 100 / exchangeRate
	}

	totalAmount = convertedAmount - brokerCharge

	result := map[string]float64{
		"originalAmount": amount,
		"convertedAmount": convertedAmount,
		"brokerCharge":    brokerCharge,
		"totalAmount":     totalAmount,
	}
	return result
}

func main() {
	result1 := performExchange(1000, 7.12, "USD to YUAN", true)
	fmt.Println("USD to YUAN Exchange Result:", result1)

	result2 := performExchange(7120, 7.12, "YUAN to USD", false)
	fmt.Println("YUAN to USD Exchange Result:", result2)
}
