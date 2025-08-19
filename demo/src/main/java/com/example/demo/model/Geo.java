package com.example.demo.model;

public class Geo {
    private static String country;
    private static String countryCode;
    private static String locale;
    private static String currencyCode;
    private static String currencySymbol;
    private static String currencyFormat;
    private static String dateFormat;
    private static String state;
    private static String city;
    private static double latitude;
    private static double longitude;

    static {
        country = "USA";
        countryCode = "US";
        locale = "en_US";
        currencyCode = "USD";
        currencySymbol = "$";
        currencyFormat = "$#,##0.00";
        dateFormat = "MM/dd/yyyy";
        state = "California";
        city = "San Francisco";
        latitude = 37.7749;
        longitude = -122.4194;
    }

    public static String getCountry() {
        return country;
    }

    public static String getCountryCode() {
        return countryCode;
    }

    public static String getLocale() {
        return locale;
    }

    public static String getCurrencyCode() {
        return currencyCode;
    }

    public static String getCurrencySymbol() {
        return currencySymbol;
    }

    public static String getCurrencyFormat() {
        return currencyFormat;
    }

    public static String getDateFormat() {
        return dateFormat;
    }

    public static String getState() {
        return state;
    }

    public static String getCity() {
        return city;
    }

    public static double getLatitude() {
        return latitude;
    }

    public static double getLongitude() {
        return longitude;
    }
}
