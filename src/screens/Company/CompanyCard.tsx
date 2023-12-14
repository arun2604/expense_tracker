import React, {useState} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {Card, IconButton, Text} from 'react-native-paper';
import {Theme} from '../../theme/Theme';
import DialogCard from '../../components/dialogCard/dialogCard';
import {useAppTheme} from '../../../App';

interface companyProps {
  id: number;
  name: string;
  phoneNo: string;
  email: string;
  landmark: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

const CompanyCard = (props: companyProps): JSX.Element => {
  const {
    id,
    name,
    phoneNo,
    email,
    landmark,
    city,
    state,
    zipCode,
    country,
    onEdit,
    onDelete,
  } = props;
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  const hideDialog = () => {
    setIsDialogVisible(false);
  };
  const {
    colors: {onSurfaceVariant, outline, background},
  } = useAppTheme();

  const onClickConfirm = (id: number) => {
    onDelete(id);
    setIsDialogVisible(false);
  };

  return (
    <ScrollView>
      <Card
        style={[styles.container, {backgroundColor: background}]}
        elevation={3}>
        <Card.Title
          title={name}
          titleStyle={[styles.title, {color: onSurfaceVariant}]}
        />
        <Card.Content>
          <View style={styles.contactContainer}>
            <Text style={{color: onSurfaceVariant}}>{phoneNo}</Text>
            <Text style={{color: onSurfaceVariant}}>{email}</Text>
          </View>
          <View style={styles.addressWrapper}>
            <View style={styles.addressContainer}>
              <View style={styles.cityContainer}>
                <Text style={{color: onSurfaceVariant}}>{landmark}, </Text>
                <Text style={{color: onSurfaceVariant}}>{city}</Text>
              </View>
              <Text style={{color: onSurfaceVariant}}>
                {state} - {zipCode}
              </Text>
              <Text style={{color: onSurfaceVariant}}>{country}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <IconButton
                iconColor={onSurfaceVariant}
                icon="pencil"
                size={20}
                onPress={() => onEdit(id)}
              />
              <IconButton
                icon="trash-can-outline"
                iconColor={Theme.CANCEL_PRIMARY}
                size={20}
                onPress={() => setIsDialogVisible(true)}
              />
            </View>
          </View>
        </Card.Content>
      </Card>
      <DialogCard
        message="Are you sure you want to delete?"
        isDialogVisible={isDialogVisible}
        setIsDialogVisible={setIsDialogVisible}
        onConfirm={() => onClickConfirm(id)}
      />
    </ScrollView>
  );
};

export default CompanyCard;

const styles = StyleSheet.create({
  container: {
    margin: 5,
  },
  title: {
    fontWeight: '700',
    color: Theme.SECONDARY,
  },
  contactContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressContainer: {
    marginTop: 5,
  },
  cityContainer: {
    flexDirection: 'row',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginLeft: 'auto',
  },
});
