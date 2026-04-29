import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Chip,
  EmptyState,
  Skeleton,
  Text,
} from "@shared/ui";
import { useTheme } from "@shared/theme";
import { formatEur, formatArea } from "@shared/lib";

export default function DesignSystemDemo() {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: spacing[5], gap: spacing[6] }}>
        <View style={{ gap: spacing[2] }}>
          <Text variant="overline" muted>Estela · Design System</Text>
          <Text variant="display">Cartera viva</Text>
          <Text variant="body" muted>
            Vista previa del sistema editorial. Tipografía Playfair + Inter sobre crema.
          </Text>
        </View>

        <Card variant="elevated" padding="lg">
          <View style={{ gap: spacing[3] }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text variant="title">Ático en Salamanca</Text>
              <Badge label="Reservado" tone="warning" />
            </View>
            <Text variant="body" muted>3 dorm · 2 baños · {formatArea(142)}</Text>
            <Text variant="subtitle" color={colors.accent}>{formatEur(890000)}</Text>
          </View>
        </Card>

        <View style={{ gap: spacing[3] }}>
          <Text variant="subtitle">Variantes texto</Text>
          <Text variant="display">Display</Text>
          <Text variant="title">Title serif</Text>
          <Text variant="subtitle">Subtitle sans</Text>
          <Text variant="body">Body regular para descripciones largas.</Text>
          <Text variant="bodyStrong">Body strong para énfasis.</Text>
          <Text variant="caption" muted>Caption · metadata</Text>
          <Text variant="overline" muted>Overline tag</Text>
        </View>

        <View style={{ gap: spacing[3] }}>
          <Text variant="subtitle">Botones</Text>
          <Button label="Acción primaria" onPress={() => {}} />
          <Button label="Secundaria" variant="secondary" onPress={() => {}} />
          <Button label="Ghost" variant="ghost" onPress={() => {}} />
          <Button label="Eliminar" variant="destructive" onPress={() => {}} />
          <Button label="Cargando" loading onPress={() => {}} />
          <Button label="Deshabilitado" disabled onPress={() => {}} />
        </View>

        <View style={{ gap: spacing[3] }}>
          <Text variant="subtitle">Chips</Text>
          <View style={{ flexDirection: "row", gap: spacing[2], flexWrap: "wrap" }}>
            <Chip label="Todos" selected onPress={() => {}} />
            <Chip label="Venta" onPress={() => {}} />
            <Chip label="Alquiler" onPress={() => {}} />
            <Chip label="Reservados" onPress={() => {}} />
          </View>
        </View>

        <View style={{ gap: spacing[3] }}>
          <Text variant="subtitle">Badges</Text>
          <View style={{ flexDirection: "row", gap: spacing[2], flexWrap: "wrap" }}>
            <Badge label="Nuevo" tone="accent" />
            <Badge label="Activo" tone="success" />
            <Badge label="Reservado" tone="warning" />
            <Badge label="Vendido" tone="danger" />
            <Badge label="Borrador" tone="neutral" />
          </View>
        </View>

        <View style={{ gap: spacing[3] }}>
          <Text variant="subtitle">Avatares</Text>
          <View style={{ flexDirection: "row", gap: spacing[3], alignItems: "center" }}>
            <Avatar name="Francesca Antelo" size={56} />
            <Avatar name="Marc Soler" size={48} />
            <Avatar name="Lucía García" />
          </View>
        </View>

        <View style={{ gap: spacing[3] }}>
          <Text variant="subtitle">Skeletons</Text>
          <Card padding="md" variant="outlined">
            <View style={{ gap: spacing[2] }}>
              <Skeleton height={20} width="60%" />
              <Skeleton height={14} width="90%" />
              <Skeleton height={14} width="40%" />
            </View>
          </Card>
        </View>

        <Card variant="cream" padding="lg">
          <EmptyState
            title="Sin resultados"
            description="No hay inmuebles que coincidan con los filtros aplicados."
            actionLabel="Limpiar filtros"
            onAction={() => {}}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
