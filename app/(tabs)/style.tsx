import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      maxWidth: 500,
      marginHorizontal: 'auto'
    },
    header: {
      padding: 16,
      paddingTop: Platform.OS === 'ios' || Platform.OS === 'android' ? 48 : 16,
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    title: {
      fontSize: 16,
      fontWeight: 'bold',
      marginRight: 8
    },
    themeToggle: {
      padding: 4
    },
    progressButton: {
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginRight: 8
    },
    progressText: {
      fontSize: 12,
      fontWeight: '600'
    },
    tabs: {
      flexDirection: 'row',
      borderRadius: 6,
      padding: 2
    },
    tab: {
      paddingVertical: 4,
      paddingHorizontal: 6,
      marginHorizontal: 1,
      borderRadius: 4
    },
    activeTab: {
      // Optional active tab styling
    },
    content: {
      flex: 1
    },
    filterScroll: {
      paddingHorizontal: 12,
      paddingVertical: 8
    },
    filterChip: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 8,
      borderWidth: 1,
      height: 28
    },
    filterText: {
      fontSize: 13
    },
    list: {
      position: 'absolute',
      top: 45,
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 12,
      paddingBottom: 12,
    },
    reviewHeader: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#dee2e6'
    },
    reviewTitle: {
      fontSize: 16,
      fontWeight: 'bold'
    },
    emptyReviewContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 100
    },
    emptyReviewText: {
      fontSize: 16,
      marginTop: 16,
      textAlign: 'center'
    },
    card: {
      marginTop: 8,
      marginBottom: 8,
      borderRadius: 12,
      overflow: 'hidden',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8
        },
        android: {
          elevation: 4
        }
      })
    },
    cardGradient: {
      padding: 16
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12
    },
    word: {
      fontSize: 20,
      fontWeight: 'bold'
    },
    levelBadge: {
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 12
    },
    levelText: {
      fontSize: 12
    },
    wordImage: {
      width: '100%',
      height: 150,
      borderRadius: 8,
      marginBottom: 12
    },
    definition: {
      fontSize: 16,
      lineHeight: 24,
      marginBottom: 12
    },
    exampleContainer: {
      padding: 12,
      borderRadius: 8,
      marginBottom: 12
    },
    exampleLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      marginBottom: 4
    },
    example: {
      fontSize: 14,
      fontStyle: 'italic'
    },
    cardFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 8
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    dateText: {
      marginLeft: 6,
      fontSize: 13
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    statusText: {
      marginLeft: 6,
      fontSize: 13,
      fontWeight: '500'
    },
    reviewButton: {
      padding: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 12
    },
    reviewButtonText: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'bold'
    },
    addForm: {
      padding: 16
    },
    input: {
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
      fontSize: 16,
      borderWidth: 1
    },
    textArea: {
      height: 100,
      textAlignVertical: 'top'
    },
    labelText: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8
    },
    levelSelector: {
      flexDirection: 'row',
      marginBottom: 24
    },
    levelOption: {
      flex: 1,
      paddingVertical: 12,
      borderWidth: 1,
      marginRight: 8,
      borderRadius: 8,
      alignItems: 'center'
    },
    selectedLevel: {
      borderColor: 'transparent'
    },
    levelOptionText: {
      fontSize: 14
    },
    selectedLevelText: {
      color: 'white'
    },
    addButton: {
      padding: 16,
      borderRadius: 8,
      alignItems: 'center'
    },
    addButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold'
    }
  });
  